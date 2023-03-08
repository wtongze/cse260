export function download(content: Blob, fileName: string) {
  let element = document.createElement('a');
  element.setAttribute('href', URL.createObjectURL(content));
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
