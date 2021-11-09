export const vertexShader = () => {
    fetch('./assets/vertexShader.txt')
        .then(response => response.text())
        .then(data => console.log(data));
}
