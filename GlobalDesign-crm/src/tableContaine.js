import React from 'react';
import UniwersalnaTabela from './universalTable';

function KontenerTabel() {
  const tables = [
    { tableName: 'Tabela1', primaryKey: 'abc123' },
    { tableName: 'Tabela2', primaryKey: 'def456' },
    { tableName: 'Tabela3', primaryKey: 'ghi789' },
  ];

  return (
    <div>
      <h2>Kontener Tabel</h2>
      {tables.map((table) => (
        <UniwersalnaTabela key={table.primaryKey} tableName={table.tableName} primaryKey={table.primaryKey} />
      ))}
    </div>
  );
}

export default KontenerTabel;
