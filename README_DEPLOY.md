# Guía de Despliegue: Importar España

Esta guía te explica paso a paso cómo subir tu web a internet y conectarla a tu dominio `importarespaña.com`.

## Resumen de la Estrategia
1. **Código**: Subiremos tu código a **GitHub**.
2. **Backend (Cerebro)**: Usaremos **Render** (gratis/barato) para ejecutar el servidor Node.js.
3. **Frontend (Cara)**: Usaremos **Vercel** (gratis) para alojar la web React.
4. **Dominio**: Configuraremos **DonDominio** para que apunte a Vercel.

---

## Paso 1: Subir a GitHub
Ya he preparado tu código localmente. Ahora necesitas subirlo a la nube.

1. Ve a [GitHub.com](https://github.com) y crea un **Nuevo Repositorio** (New Repository).
   - Nombre: `importar-espana` (o lo que quieras).
   - Público o Privado (da igual).
   - **NO** marques "Initialize with README" ni .gitignore (ya los tenemos).
2. Copia la URL del repositorio (ej: `https://github.com/tu-usuario/importar-espana.git`).
3. En tu terminal (aquí en VS Code), ejecuta estos comandos (sustituyendo la URL):

```bash
git remote add origin https://github.com/TU_USUARIO/importar-espana.git
git branch -M main
git push -u origin main
```

---

## Paso 2: Desplegar Backend (Render)
Esto hará que tu API funcione en internet.

1. Ve a [dashboard.render.com](https://dashboard.render.com/) y crea una cuenta.
2. Click en **New +** -> **Web Service**.
3. Conecta tu cuenta de GitHub y selecciona el repo `importar-espana`.
4. Configuración:
   - **Name**: `vehicle-analyzer-api`
   - **Root Directory**: `backend` (IMPORTANTE)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: Free (o Starter si quieres más velocidad).
5. Click **Create Web Service**.
6. Espera a que termine. Copia la URL que te dan (ej: `https://vehicle-analyzer-api.onrender.com`). **Guárdala**.

---

## Paso 3: Desplegar Frontend (Vercel)
Esto hará que tu web sea visible.

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta.
2. Click **Add New...** -> **Project**.
3. Importa el repo `importar-espana` desde GitHub.
4. Configuración:
   - **Framework Preset**: Vite (lo detectará solo).
   - **Root Directory**: `frontend` (Edit -> selecciona la carpeta `frontend`).
   - **Environment Variables**:
     - Clave: `VITE_API_URL`
     - Valor: La URL de Render que copiaste en el paso 2 (SIN la barra al final, ej: `https://vehicle-analyzer-api.onrender.com`).
5. Click **Deploy**.

---

## Paso 4: Conectar Dominio (DonDominio)
Ahora haremos que `importarespaña.com` muestre tu web de Vercel.

1. En el panel de tu proyecto en **Vercel**:
   - Ve a **Settings** -> **Domains**.
   - Escribe `importarespaña.com` y dale a **Add**.
   - También añade `www.importarespaña.com`.
2. Vercel te mostrará unos valores DNS (normalmente un **A Record** y un **CNAME**).
   - **A Record**: `76.76.21.21` (ejemplo, verifica en Vercel).
   - **CNAME**: `cname.vercel-dns.com` (para www).
3. Ve a tu panel de **DonDominio**:
   - Entra en la gestión de tu dominio.
   - Busca **Zona DNS** o **Registros DNS**.
   - Edita (o crea) los registros para que coincidan con lo que pide Vercel.
     - `@` (o vacío) -> Tipo A -> Valor `76.76.21.21`
     - `www` -> Tipo CNAME -> Valor `cname.vercel-dns.com`
4. Espera unos minutos (puede tardar hasta 24h, pero suele ser rápido).

¡Listo! Tu web estará online en `importarespaña.com`.
