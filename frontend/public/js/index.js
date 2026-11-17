async function loadWelcomeGif() {

    try {// dopo la richiesta get all'endpoint /api/v1/auth/me

        const response =await fetch("/api/v1/auth/me"); //prendi il get
        if (!response.ok) {throw new Error(`HTTP ${response.status}`);
        }

        const user = await response.json();
        if (!user.authenticated) {
            return;
        }

        const welcomeContent =
            document.getElementById("welcome-content");
        if (!welcomeContent) {
            return;
        }

        const box =
            document.createElement("div"); //preparo il div
        box.className = "welcome-box";

        const img =
            document.createElement("img");
        img.src = "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif";
        img.alt ="Welcome Gif";

        //--------------------button---------------------
        const button =document.createElement("button"); //aggiungo bottone
        button.textContent ="Data";
        const output = document.createElement("div");
        output.className = "output";//class
        //-----incapsulo tutto--------------------------
        box.append(img, button, output);
        welcomeContent.appendChild(box);

        //-----------------funzioen button------------
        button.addEventListener("click", async () => {//evento bottone -->richiesta endpoint

        const response = await fetch("/api/v1/data/db");
        const result = await response.json();

        console.log(result);
        output.textContent =JSON.stringify(result);

    }
);
        
    } catch (err) {console.error(err);}
}

window.addEventListener(
    "DOMContentLoaded",
    loadWelcomeGif
);