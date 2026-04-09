import EmbeddedPostgres from 'embedded-postgres';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

let pg = null;

export async function startDatabase() {
    const dataDir = path.join(app.getPath('userData'), 'pgdata');
    const flagFile = path.join(app.getPath('userData'), '.db_initialized');

    // Resolve o caminho do dump empacotado
    const seedPath = path.join(
        process.resourcesPath,
        'app.asar.unpacked',
        'app/database/seed.sql'
    );

    pg = new EmbeddedPostgres({
        databaseDir: dataDir,
        user: 'senac',
        password: 'senac',
        port: 5433,
        persistent: true,
    });

    await pg.initialise();
    await pg.start();

    const isFirstBoot = !fs.existsSync(flagFile);

    if (isFirstBoot) {
        console.log('Primeiro boot: restaurando banco...');

        await pg.createDatabase('seqouia_db');

        // Restaura o dump SQL
        execSync(
            `psql -h 127.0.0.1 -p 5433 -U senac -d seqouia_db -f "${seedPath}"`,
            { env: { ...process.env, PGPASSWORD: 'senac' } }
        );

        // Marca como inicializado
        fs.writeFileSync(flagFile, new Date().toISOString());
        console.log('✅ Banco restaurado com sucesso.');
    } else {
        console.log('Banco já inicializado, iniciando normalmente.');
    }
}

export async function stopDatabase() {
    if (pg) await pg.stop();
}