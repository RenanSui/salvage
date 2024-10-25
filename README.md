<div align="center">
  <img alt="Salvage Title" src=".github/images/salvage-title.png" width="800px" />
</div>

<h1 align="center">Copy and Backup Automation Tool</h1>
<p align="center">A simple and effective way to copy files and automate your backups.</p>
<p align="center">Bootstrapped with <a href="https://tauri.app/v1/guides/getting-started/setup/" target="_blank">create-tauri-app</a> </p>

[![Salvage](.github/images/salvage-screen-dark.png)](https://github.com/RenanSui/salvage)

[![Salvage](.github/images/salvage-screen-light.png)](https://github.com/RenanSui/salvage)

## Built With:
- **Frameworks:** [Next.js](https://nextjs.org), [Tauri](https://tauri.app)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Components Library:** [Shadcn UI](https://ui.shadcn.com)
- **Form:** [React Hook Form](https://react-hook-form.com)
- **Toaster:** [Shadcn UI's Toaster](https://ui.shadcn.com/docs/components/toast)
- **File Watcher:** [Notify](https://github.com/notify-rs/notify)

## Features:
- **Automatic File Monitoring:** Detect and track changes in selected files.
- **File Backup on Change:** Copy monitored files when changes are detected.
- **Exclusion List Creation:** Exclude specific files or directories from monitoring and backup.
- **Log Monitoring:** View and monitor logs for all backup activities.

## Running Locally
1. Follow the [Tauri Prerequisites](https://tauri.app/v1/guides/) guide and install Rust and Tauri

2. Clone the repository

   ```bash
   git clone https://github.com/RenanSui/salvage.git
   ```

3. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

4. Start the development server

   ```bash
   pnpm tauri dev
   ```
5. Build for production
 
   ```bash
   pnpm tauri build
   ```

## How do I deploy this?

Follow the deployment guides for [Tauri](https://tauri.app/v1/guides/) for more information.

## License

Licensed under the MIT License. Check the [LICENSE](./LICENSE) file for details.
