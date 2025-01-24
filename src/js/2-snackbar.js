import iziToast from 'izitoast';

const snackbarForm = document.querySelector('.form');

const findCheckedInput = () => {
  const inputRadioList = [...snackbarForm.elements.state];
  for (const el of inputRadioList) {
    if (el.checked === true) {
      return el.value;
    }
  }
};

const createPromise = (delay, state) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(`Fulfilled promise in ${delay}ms`);
      } else {
        reject(`Rejected promise in ${delay}ms`);
      }
    }, delay);
  });

  return promise;
};

const onsnackbarFormSubmit = event => {
  event.preventDefault();

  const state = findCheckedInput() || null;
  const delay = snackbarForm.elements.delay.value || null;

  if (delay === null) {
    iziToast.warning({
      title: 'Pease fill out the delay',
      position: 'topRight',
    });
    return;
  } else if (state === null) {
    iziToast.warning({
      title: 'Please select the state',
      position: 'topRight',
    });
    return;
  }

  createPromise(delay, state)
    .then(result => {
      iziToast.success({
        title: result,
        position: 'topRight',
      });
    })
    .catch(result => {
      iziToast.error({
        title: result,
        position: 'topRight',
      });
    });

  snackbarForm.reset();
};

snackbarForm.addEventListener('submit', onsnackbarFormSubmit);
