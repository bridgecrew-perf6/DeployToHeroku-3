async function getSignatures(apiUrl, extension) {
  if (!apiUrl) {
    throw 'Please provide an API URL';
  }
  if (!extension) {
    throw 'Please provide an extension';
  }
  const response = await fetch(`${apiUrl}sign/${extension}`);
  if (response.ok) {
    return response.json();
  } else {
    const error = await response.text();
    return error;
  }
};

function progressNotifier(progressEvent) {
  const progressElement = document.getElementById('progressbar');
  const total = progressEvent.total;
  const current = progressEvent.loaded;
  if (current && total) {
    progressElement.setAttribute('max', total);
    progressElement.setAttribute('value', current);
  }
}

function postFormData(url, formData, progress) {
  return new Promise((resolve, reject) => {

  });
}

function uploadBlob(uploadPolicy, fileBlob, progress) {
  const formData = new window.FormData();
  Object.keys(uploadPolicy.fields).forEach((key) => {
    formData.append(key, uploadPolicy.fields[key])
  });
  formData.append('file', fileBlob);
  return postFormData(uploadPolicy.url, formData, progress)
    .catch(e => {
      if (parseXML(e, 'Code') === 'EntityTooLarge') {
        throw `File ${fileBlob.name} is too big to upload.`;
      };
      throw 'server error';
    });
};



async function startUpload(evt) {
  const picker = evt.taget;
  const file = picker.files && picker.files[0];
  const apiUrl = document.getElementById('apiurl').value;
  if ( file && file.name) {
    picker.value = '';
    try {
      const extension = file.name.replace(/.+\./g, '');
      if (!extension) {
        throw `${file.name} has no extension`;
      }
      showStep('uploading');
      const signatures = await getSignatures(apiUrl, extension);
      await uploadBlob(signatures.upload, file, progressNotifier);
    } catch {

    }
  }
}

function showStep(label) {
  const sections = Array.from(document.querySelectorAll('[step]'));
  sections.forEach(section => {
    if (section.getAttribute('step') === label) {
      section.style.display = '';
    } else {
      section.style.display = 'none';
    }
  });
};

function initPage() {
  const picker = document.getElementById('picker');
  showStep('initial');
  picker.addEventListener('change', startUpload);
};

window.addEventListener('DOMContentLoaded', initPage);

