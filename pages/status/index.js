import useSWR from "swr";
export default function StatusPage() {
  const fetchAPI = (...args) => fetch(...args).then(res => res.json());

  const { data, error, isLoading } = useSWR(`/api/v1/status`, fetchAPI, {
    refreshInterval: 2000,
  });

  if (error) return <div>Falha na atualização do status</div>;
  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <UpdatedAt data={data} />
      <Dependency data={data} />
    </div>
  );
}

function UpdatedAt({ data }) {
  const updatedAt = new Date(data.updated_at);
  const formattedDate = updatedAt.toLocaleString("pt-BR");
  return <div>Ultima atualização: {formattedDate}</div>;
}
function Dependency({ data }) {
  const dependencies = data.dependencies;
  return (
    <div>
      <h2>Dependências</h2>
      <ul>
        <li>
          <h3>Banco de dados</h3>
          <ul>
            <li>Versão: {dependencies.database.version}</li>
            <li>Máximo de conexões: {dependencies.database.max_connections}</li>
            <li>
              Conexões abertas: {dependencies.database.opened_connections}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
