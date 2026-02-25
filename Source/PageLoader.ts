

/**
 * Transition to another url in a seamingless way.
 * Will begin by fading the entire body of the current body, leaving only the main background.
 * Then, the new page will load, and once ready, it will be swapped.
 * @param url 
 */
async function TransitionToPage(url: string) {
    const content = document.querySelector(".MainContent");
    if (!content) {
        throw new Error("This shouldn't ever happen, but TS complains");
    }

    content.classList.add("fade-out");
    const delay = new Promise((resolve) => setTimeout(resolve, 500));

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load page: ${response.statusText}`);
    }
    const html = await response.text();

    // As the fetch should fetch the entire new website, we will only replace the .MainContent
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(html, "text/html");
    const newContent = newDoc.querySelector(".MainContent");
    if (!newContent) {
        throw new Error("New page does not have a .MainContent element");
    }

    await delay;
    content.innerHTML = newContent.innerHTML;

    // innerHTML does not execute scripts -- re-create and append them manually
    const scripts = Array.from(content.querySelectorAll("script"));
    for (const oldScript of scripts) {
        const newScript = document.createElement("script");
        for (const attr of Array.from(oldScript.attributes)) {
            newScript.setAttribute(attr.name, attr.value);
        }
        newScript.textContent = oldScript.textContent;
        oldScript.replaceWith(newScript);
    }

    content.classList.remove("fade-out");
    content.classList.add("fade-in");

    window.history.pushState({}, "", url);

    setTimeout(() => {
        content.classList.remove("fade-in");
    }, 500);
}
