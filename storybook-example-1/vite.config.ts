import * as path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  optimizeDeps: {
    exclude: ['swiper/vue']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // updates the snapshots
    update: true,
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'tredz-component-library',
      fileName: (format) => `tredz-component-library.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vue-fuse', 'fuse.js'],
      output: {
        globals: {
          vue: 'Vue',
          'fuse.js': 'Fuse'
        }
      }
    },
    commonjsOptions: {
      include: ['tailwind.config.js', 'node_modules/**']
    }
  }
});
