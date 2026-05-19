
async function buscarDados() {
    const resposta = await fetch("https://jsonplaceholder.typicode.com/users");
    return await resposta.json();
}

async function main() {
    const dados = await buscarDados();

    dados.map(usuario => {
        console.log(`Nome: ${usuario.name} - Email: ${usuario.email}`);
    });
  }
main();

async function main2() {
    const dados = await buscarDados();

    dados.forEach(usuario => {
        console.log(`Nome: ${usuario.name} - Empresa: ${usuario.company.name}`);
    });
}
main2();  

