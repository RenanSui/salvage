<div align="center">
  <img alt="Salvage Title" src=".github/images/salvage-title.png" width="800px">
</div>

<p align="center">Copy files comfortably and automate your backups.</p>
<p align="center">Bootstrapped with <a href="https://github.com/alex8088/quick-start/tree/master/packages/create-electron" target="_blank">create-electron</a> </p>

[![Salvage](.github/images/salvage-screens.png)](https://github.com/RenanSui/salvage)

## Tech Stack

- **Frameworks:** [React](https://react.dev) + [Electron](https://www.electronjs.org/pt/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Store:** [Electron Store](https://github.com/sindresorhus/electron-store)
- **Updater:** [Electron Updater](https://www.npmjs.com/package/electron-updater)
- **File Watcher:** [Chokidar](https://github.com/paulmillr/chokidar)
- **File Management:** [FS-Extra](https://github.com/jprichardson/node-fs-extra)
- **Form:** [React Hook Form](https://react-hook-form.com)
- **Toaster:** [Sonner](https://sonner.emilkowal.ski)

## Features

- Copy files from Source to Destination
- Automatically monitor files
- Copy monitored files when changes occur

## Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/RenanSui/salvage.git
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Start the development server

   ```bash
   pnpm run dev
   ```
4. Build for production
 
   ```bash
   pnpm run build:win
   ```

## How do I deploy this?

Follow the deployment guides for [Electron Vite](https://electron-vite.org/guide/distribution) and [Electron Builder](https://www.electron.build) for more information.

## License

Licensed under the MIT License. Check the [LICENSE](./LICENSE) file for details.
