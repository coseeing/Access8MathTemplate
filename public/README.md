## Access8Math Web Template

This app is designed to display rich math content by consuming one only config file.

### Config

To use this app, kindly generate the configuration according to the specified rules and practices.

**path**: `{root}/content-config.js`

| Field          | Description                                         | Type   | Enum Values     |
| -------------- | --------------------------------------------------- | ------ | --------------- |
| latexDelimiter | Config for LaTeX delimiter.                         | Enum   | bracket, dollar |
| documentFormat | Determines the display style for the LaTeX content. | Enum   | block, inline   |
| sourceText     | The source content as a string.                     | String |                 |
| documentColor  | Determines the color scheme for the document.       | Enum   | light, dark     |
