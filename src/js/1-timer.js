import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const addLeadingZero = value => String(value).padStart(2, 0);

let userSelectedDate = null;

const inputDateBtnEl = document.querySelector('button[data-start]');
const inputDateEl = document.querySelector('#datetime-picker');
const timerDaysEl = document.querySelector('span[data-days]');
const timerHoursEl = document.querySelector('span[data-hours]');
const timerMinutesEl = document.querySelector('span[data-minutes]');
const timerSecondsEl = document.querySelector('span[data-seconds]');

// create datetime picker
flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const [selectedDate] = selectedDates;

    if (selectedDate <= Date.now()) {
      iziToast.error({
        title: 'Please choose a date in the future',
        position: 'topRight',
      });
      inputDateBtnEl.disabled = true;
      return;
    }

    inputDateBtnEl.disabled = false;
    userSelectedDate = selectedDate;
  },
});

// create timer
const onDeadlineBtnClick = () => {
  inputDateEl.disabled = true;
  inputDateBtnEl.disabled = true;

  const intervalId = setInterval(() => {
    const timeToDeadline = userSelectedDate - Date.now();

    if (timeToDeadline <= 0) {
      clearInterval(intervalId);
      inputDateEl.disabled = false;
      inputDateBtnEl.disabled = false;
      return;
    }

    const time = convertMs(timeToDeadline);
    const { days, hours, minutes, seconds } = time;

    timerDaysEl.textContent = addLeadingZero(days);
    timerHoursEl.textContent = addLeadingZero(hours);
    timerMinutesEl.textContent = addLeadingZero(minutes);
    timerSecondsEl.textContent = addLeadingZero(seconds);
  }, 1000);
};

inputDateBtnEl.addEventListener('click', onDeadlineBtnClick);
