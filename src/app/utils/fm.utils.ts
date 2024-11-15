export function exportJsonFile(data: any, fileName: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function importJsonFile(event: Event, cb: any): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        cb(jsonData);
      } catch (error) {
        cb(null);
      }
    };
    reader.readAsText(file);
  }
}
