import { Search, X } from "lucide-react";

function SearchBar({ setFiltro, onClear, valor }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <Search size={14} strokeWidth={2} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por nome de usuário ou empresa..."
          value={valor}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      <button className="btn-clear" onClick={onClear}>
        <X size={13} strokeWidth={2} />
        Limpar
      </button>
    </div>
  );
}

export default SearchBar;
