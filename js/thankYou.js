async function sendFormData() {
  const formDataRaw = localStorage.getItem("formData");
  if (!formDataRaw) {
    return;
  }

  const formDataObj = JSON.parse(formDataRaw);


  // Prepare FormData for API
  const formData = new FormData();
  formData.append("Ism", data.Ism);
  formData.append("Telefon raqam", data.TelefonRaqam);
  formData.append("Royhatdan o'tgan vaqti", data.SanaSoat);
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzAZYey17jlk6abE88IOkx6nZk0tuM4wmCx3aHsNF8bQ4ZDxOgJGERPmqZ_Cci0eeENyg/exec",
      {
        method: "POST",
        body: formData,
      }
    );
    
    
    if (response.ok) {
      localStorage.removeItem("formData");
    } else {
      throw new Error("API response was not ok");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    document.getElementById("errorMessage").style.display = "block";
  }
}

// Send data when page loads
window.onload = sendFormData;