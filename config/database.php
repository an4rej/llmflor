<?php
/**
 * Подключение к MySQL 8.0 (Timeweb).
 * Читает переменные из окружения или из файла .env в корне проекта (на уровень выше этого каталога).
 */
declare(strict_types=1);

/**
 * Подгружает KEY=VALUE из .env (без кавычек, без export). Пустые строки и # комментарии игнорируются.
 */
function florista_load_dotenv(?string $path = null): void
{
    $base = dirname(__DIR__);
    $file = $path ?? $base . DIRECTORY_SEPARATOR . '.env';
    if (!is_readable($file)) {
        return;
    }
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (!str_contains($line, '=')) {
            continue;
        }
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k);
        $v = trim($v);
        if ($k === '' || getenv($k) !== false) {
            continue;
        }
        putenv("$k=$v");
        $_ENV[$k] = $v;
    }
}

/**
 * @return array{host:string,port:int,name:string,user:string,pass:string,charset:string}
 */
function florista_db_config(): array
{
    florista_load_dotenv();

    $port = (int) (getenv('DB_PORT') ?: '3306');
    if ($port < 1 || $port > 65535) {
        $port = 3306;
    }

    return [
        'host' => getenv('DB_HOST') ?: 'localhost',
        'port' => $port,
        'name' => getenv('DB_NAME') ?: 'cv028576_llmflo',
        'user' => getenv('DB_USER') ?: 'cv028576_llmflo',
        'pass' => getenv('DB_PASSWORD') ?: getenv('DB_PASS') ?: 'R2d2111@123',
        'charset' => getenv('DB_CHARSET') ?: 'utf8mb4',
    ];
}

/**
 * DSN для PDO MySQL.
 */
function florista_db_dsn(): string
{
    $c = florista_db_config();
    return sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $c['host'],
        $c['port'],
        $c['name'],
        $c['charset']
    );
}

/**
 * PDO с типичными опциями для UTF-8 и ошибок.
 */
function florista_db_pdo(): PDO
{
    $c = florista_db_config();
    if ($c['user'] === '') {
        throw new RuntimeException('Задайте DB_USER в .env или в окружении сервера.');
    }
    $pdo = new PDO(florista_db_dsn(), $c['user'], $c['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $charset = strtolower($c['charset']) === 'utf8mb4' ? 'utf8mb4' : 'utf8mb4';
    $pdo->exec('SET NAMES ' . $charset . ' COLLATE utf8mb4_unicode_ci');
    return $pdo;
}
