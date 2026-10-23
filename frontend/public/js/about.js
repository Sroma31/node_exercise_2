document.getElementById("hello-button").addEventListener("click", async function () {
    const res = await fetch("/api/hello");
    const data = await res.json();

    document.getElementById("hello-result").textContent = JSON.stringify(data);
});
