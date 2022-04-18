export default function getEnv(name) {
    return _env_?.[name] || process.env[name]
}
