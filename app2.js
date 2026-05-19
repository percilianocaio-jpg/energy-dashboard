async function buscarDados() {
    try {
        const resposta = await fetch("https://jsonplaceholder.typicode.com/users");
        return await resposta.json();
    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
        return [];
    }
}

async function main() {
    const dados = await buscarDados();

    dados
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(usuario => {
            console.log(`Nome: ${usuario.name} - Email: ${usuario.email}`);
            console.log(`Empresa: ${usuario.company.name}`);
            console.log("----------------------");
        });
}

main();