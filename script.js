
  const searchInput = document.querySelector("#search");
  const tableBody = document.querySelector("#table-body");
  const spinner = document.querySelector("#spinner-loader");
  const noResult = document.querySelector(".text-no-result");
  const limitInput = document.querySelector("#limit");
  const limitError = document.querySelector("#limit-error");
  const apiErrorElement = document.querySelector("#api-error");

  let API_URL = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities`;
  let usersList = [];

  /**
   * Method to fetch countries data
   */
  async function fetchUserData() {
    handleLoader(true);
    handleInputVisibility(true);

    try {
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "036ce5deb2mshd3ac442088f969cp13539bjsnabdfedd91e5d",
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        },
      };

      const limit = limitInput.value;
      if (usersList.length > 0 && Number(limit) === usersList.length) {
        limitError.style.display = "none";
        handleLoader(false);
        handleInputVisibility(false);
        return;
      }

      if (limit > 10) {
        limitError.style.display = "block";
        handleLoader(false);
        handleInputVisibility(false);
        return;
      } else {
        limitError.style.display = "none";
      }

      const url = `${API_URL}${limit !== "" ? `?limit=${limit}` : ""}`;
      const response = await fetch(url, options);
      const jsonData = await response.json();

      usersList = jsonData.data.map((item) => ({
        placeName: item.name,
        country: item.country,
        countryCode: item.countryCode,
      }));
      renderResults(usersList);

      apiErrorElement.style.display = "none";
      handleLoader(false);
      handleInputVisibility(false);
    } catch (error) {
      apiErrorElement.style.display = "block";
      handleLoader(false);
      handleInputVisibility(false);
    }
  }

  /**
   * Method to render users data
   * @param {Array} results : get users data as result
   */
  function renderResults(results) {
    tableBody.innerHTML = "";
    results.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${index + 1}</td>
              <td>${item.placeName}</td>
              <td valign="middle"><img src="https://flagsapi.com/${
                item.countryCode
              }/flat/24.png" /><span>${item.country}</span></td>
          `;
      tableBody.appendChild(row);
    });
  }

  /**
   * Method to handle search
   */
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();
      const filteredResults = value ? filterCountries(value) : usersList;
      renderResults(filteredResults);
      if (filteredResults.length === 0) {
        noResult.style.display = "block";
      } else {
        noResult.style.display = "none";
      }
    }
  });

  /**
   * Method to Filter countries based on search input
   * @param {*} searchText : get search text
   * @returns
   */
  function filterCountries(searchText) {
    return usersList.filter((item) =>
      item.placeName.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  limitInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      fetchUserData();
    }
  });

  /**
   * Method to handle input visibility
   * @param {boolean} value : true means disabled and false means enabled
   */
  function handleInputVisibility(value) {
    if (value) {
      searchInput.setAttribute("disabled", "");
    } else {
      searchInput.removeAttribute("disabled");
    }
  }

  /**
   * Method to handle loader visibility
   * @param {boolean} value : true means visible and false means hidden
   */
  function handleLoader(value) {
    if (value) {
      spinner.style.display = "inline-block";
    } else {
      spinner.style.display = "none";
    }
  }

  /**
   * Method to handle shortcut key
   * @param {KeyboardEvent} e
   */
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "/") {
      e.preventDefault();
      searchInput.focus();
    }
  });

  /**
   * Method to close api error
   */
  function closeApiError(){
    apiErrorElement.style.display = "none";
  }
  
  fetchUserData();

