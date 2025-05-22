const continent = document.getElementById('continent');
const modal = new bootstrap.Modal(document.getElementById('windowCountry'));
const modalBody = document.getElementById("modal-body-content");

let allCountries = [];

async function loadCountries() {
    const url = 'https://restcountries.com/v3.1/independent?status=true&fields=name,flags,region';
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Chyba: ${res.status}`);
        allCountries = await res.json();
        showCountries('Europe'); 
    } catch (err) {
        console.error('Nepodařilo se načíst data:', err);
    }
}

function showCountries(region) {
    const listCountries = document.getElementById("listCountries");
    const filtered = allCountries.filter(c => c.region === region);

    let blocks = '';
    filtered.forEach(country => {
        blocks += `
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">                
                <div class="card h-100 shadow">
                    <img class="card-img-top" src="${country.flags.png}" alt="Vlajka">
                    <div class="card-body d-flex flex-column">
                        <h4 class="card-title">${country.name.common}</h4>
                        <a href="#" class="btn btn-info mt-auto" data-name="${country.name.common}">Informace</a>
                    </div>
                </div>
            </div>            
        `;
    });

    listCountries.innerHTML = blocks;

    document.querySelectorAll('[data-name]').forEach(button => {
        button.addEventListener('click', () => {
            const countryName = button.getAttribute('data-name');
            modal.show();
            fetch(`https://restcountries.com/v3.1/name/${countryName}`)
                .then(res => res.json())
                .then(data => {
                    const country = data[0];
                    const capital = country.capital ? country.capital.join(', ') : "N/A";
                    const area = country.area ? `${country.area.toLocaleString()} km²` : "N/A";
                    const currencies = country.currencies
                        ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ')
                        : "N/A";
                    const languages = country.languages
                        ? Object.values(country.languages).join(', ')
                        : "N/A";
                    const timezone = country.timezones ? country.timezones.join(', ') : "N/A";

                    modalBody.innerHTML = `
                        <h4>${country.name.common}</h4>
                        <img src="${country.flags.png}" alt="Vlajka" class="img-fluid mb-3">
                        <p><strong>Oficiální název:</strong> ${country.name.official}</p>
                        <p><strong>Hlavní město:</strong> ${capital}</p>
                        <p><strong>Počet obyvatel:</strong> ${country.population.toLocaleString()}</p>
                        <p><strong>Rozloha:</strong> ${area}</p>
                        <p><strong>Měna:</strong> ${currencies}</p>
                        <p><strong>Jazyky:</strong> ${languages}</p>
                        <p><strong>Časová pásma:</strong> ${timezone}</p>
                        <p><strong>Region:</strong> ${country.region}, <strong>Subregion:</strong> ${country.subregion ?? 'neuvedeno'}</p>
                    `;
                })
                .catch(() => {
                    modalBody.innerHTML = `<p class="text-danger">Nepodařilo se načíst informace o zemi.</p>`;
                });
        });
    });
}

continent.addEventListener('change', () => {
    const selected = continent.value;
    showCountries(selected);
});

loadCountries();
