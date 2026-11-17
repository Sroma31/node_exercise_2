async function loadFooter() {

    const container =
        document.getElementById("footer");

    if (!container) return;

    const html =
        await (
            await fetch(
                "/api/v1/components/footer.html"
            )
        ).text();

    container.innerHTML = html;
}

window.addEventListener(
    "DOMContentLoaded",
    loadFooter
);