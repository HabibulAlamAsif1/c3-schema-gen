const root = document.documentElement 

if (window.matchMedia("(prefers-color-scheme: dark)").matches) { root.style.colorScheme = "dark" }