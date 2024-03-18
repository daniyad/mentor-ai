import MarkdownIt from "markdown-it";

export function convertMarkdownToHtml(markdownContent: string): string {
    const md = new MarkdownIt();
    return md.render(markdownContent);
}

export function deleteTokenAndId(token: string, id: string) {
    if (!token || !id) return;
    localStorage.removeItem(token);
    localStorage.removeItem(id);
}

export function clearCookies(){
    // Target and clear the 'connect.sid' cookie specifically
    document.cookie = "connect.sid=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "connect.sid=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure; SameSite=None";
}
