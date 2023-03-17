// Helper function: toggleSpinner
function toggleSpinner(show) {
  const spinner = document.querySelector(".spinner");
  spinner.style.display = show ? "block" : "none";
}

// Helper function: cancelAppointment
async function cancelAppointment(name, phone) {
  const response = await fetch("/cancel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, phone }),
  });

  return response.ok;
}

document.addEventListener("DOMContentLoaded", function () {
  const bookingForm = document.querySelector("#booking-form");
  const queryForm = document.querySelector("#query-form");
  const successMessage = document.querySelector(".success-message");
  const errorMessage = document.querySelector(".error-message");

  // Event listener: bookingForm submit
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    toggleSpinner(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch("/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const json = await response.json();
      console.log(json);
      successMessage.textContent = `预约成功! 你的预约时间为 ${json.appointment_date}.`;
      successMessage.style.display = "block";
      errorMessage.style.display = "none";
    } else {
      const error = await response.json();
      errorMessage.textContent = `预约失败: ${error.message}`;
      errorMessage.style.display = "block";
      successMessage.style.display = "none";
    }
    toggleSpinner(false);
  });

  // Event listener: queryForm submit
  queryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    toggleSpinner(true);

    // Get the input values using getElementById
    const name = document.getElementById("query-name").value;
    const phone = document.getElementById("query-phone").value;

    // Log the input values to the console
    console.log("Name:", name);
    console.log("Phone:", phone);

    // Query the backend for the appointment date
    const response = await fetch("/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone }),
    });

    const cancelButton = document.getElementById("cancel-button");
    if (response.ok) {
      const json = await response.json();
      const appointment_date = json.appointment_date;
      console.log(appointment_date);
      document.getElementById(
        "query-result"
      ).textContent = `你的预约时间为: ${appointment_date}.`;

      cancelButton.style.display = "inline"; // Show the cancel button
    } else {
      document.getElementById("query-result").textContent =
        "查询失败，请重试。";
      cancelButton.style.display = "none"; // Hide the cancel button
    }
    toggleSpinner(false);
  });

  // Event listener: cancel-button click
  document
    .getElementById("cancel-button")
    .addEventListener("click", async (event) => {
      event.preventDefault(); // Add this line to prevent the default behavior of the button

      const name = document.getElementById("query-name").value;
      const phone = document.getElementById("query-phone").value;

      if (await cancelAppointment(name, phone)) {
        const queryResult = document.getElementById("query-result");
        queryResult.textContent = `已经取消预约: ${queryResult.textContent.slice(
          8
        )}. 你可以返回预约页面进行新的预约`;
        document.getElementById("cancel-button").style.display = "none"; // Hide the cancel button
      } else {
        alert("取消预约失败，请重试。");
      }
    });

  // Event listener: appointment-button click
  document
    .getElementById("appointment-button")
    .addEventListener("click", () => {
      document.getElementById("appointment-form-container").style.display =
        "block";
      document.getElementById("query-form-container").style.display = "none";
      document.getElementById("appointment-button").classList.add("active");
      document.getElementById("query-button").classList.remove("active");
    });

  // Event listener: query-button click
  const queryButton = document.getElementById("query-button");
  queryButton.addEventListener("click", () => {
    const appointmentFormContainer = document.getElementById(
      "appointment-form-container"
    );
    const queryFormContainer = document.getElementById("query-form-container");
    const appointmentButton = document.getElementById("appointment-button");

    appointmentFormContainer.style.display = "none";
    queryFormContainer.style.display = "block";
    appointmentButton.classList.remove("active");
    queryButton.classList.add("active");
  });
});
