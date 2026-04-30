// ✅ CORREÇÃO: componente limpo, sem duplicação de conteúdo.
// Antes, o UserList renderizava o conteúdo do card inline E importava
// este componente sem usá-lo. Agora UserList usa este componente de verdade.

function UserCard({ usuario }) {
  return (
    <div className="user-card">
      <h3>{usuario.name}</h3>
      <p>Email: {usuario.email}</p>
      <p>Empresa: {usuario.company?.name || "N/A"}</p>
    </div>
  );
}

export default UserCard;
