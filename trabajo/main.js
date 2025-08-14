const ApiUrl = 'https://my-json-server.typicode.com/Isagiraldoj/SistemasInteractivosDistribuidos/users/';
const rickAndMortyUrl = 'https://rickandmortyapi.com/api/character/';

// Obtener elementos del DOM
const usernameElement = document.getElementById('username');
const imageContainer = document.getElementById('imageContainer');
const switchBtn = document.getElementById('switchBtn');

// Inicializar con un usuario aleatorio
let currentUserId = Math.floor(Math.random() * 3) + 1; // Usuarios 1, 2 o 3

// Cargar usuario al iniciar
getUser(currentUserId);

// Evento para cambiar de usuario
switchBtn.addEventListener('click', () => {
    // Generar un nuevo ID de usuario diferente al actual (1, 2 o 3)
    let newUserId;
    do {
        newUserId = Math.floor(Math.random() * 3) + 1;
    } while (newUserId === currentUserId);
    
    currentUserId = newUserId;
    getUser(currentUserId);
});

async function getUser(userId) {
    try {
        const res = await fetch(ApiUrl + userId);

        if (res.ok) {
            const user = await res.json();
            console.log("Usuario obtenido:", user);
            
            // Mostrar nombre de usuario en la interfaz
            usernameElement.textContent = `Jugador: ${user.username}`;
            
            // Limpiar contenedor de cartas antes de cargar nuevas
            imageContainer.innerHTML = '';
            
            // Obtener las cartas del usuario
            getCharacter(user.deck);
        } else {
            throw new Error("No se encontró el usuario");
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        usernameElement.textContent = "Error al cargar usuario";
    }
}

async function getCharacter(deck) {
    try {
        // Mostrar mensaje de carga
        imageContainer.innerHTML = '<p class="loading">Cargando cartas...</p>';
        
        // Usar Promise.all para cargar todas las cartas en paralelo
        const characters = await Promise.all(
            deck.map(async characterId => {
                const res = await fetch(rickAndMortyUrl + characterId);
                if (!res.ok) throw new Error(`Error al obtener personaje ${characterId}`);
                return await res.json();
            })
        );
        
        // Limpiar contenedor
        imageContainer.innerHTML = '';
        
        // Mostrar todas las cartas
        characters.forEach(character => {
            renderCard(character);
        });
        
    } catch (error) {
        console.error("Error al obtener personajes:", error);
        imageContainer.innerHTML = '<p class="error">Error al cargar las cartas</p>';
    }
}

function renderCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';
    
    const imageElement = document.createElement('img');
    imageElement.src = character.image;
    imageElement.alt = character.name;
    imageElement.loading = "lazy"; // Mejora de rendimiento

    const nameElement = document.createElement('h3');
    nameElement.textContent = character.name;

    const speciesElement = document.createElement('p');
    speciesElement.textContent = `Especie: ${character.species}`;
    
    const statusElement = document.createElement('p');
    statusElement.textContent = `Estado: ${character.status}`;
    statusElement.className = `status-${character.status.toLowerCase()}`;

    card.appendChild(imageElement);
    card.appendChild(nameElement);
    card.appendChild(speciesElement);
    card.appendChild(statusElement);

    imageContainer.appendChild(card);
}