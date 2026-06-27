interface ModelOption {
  id: string;
  name: string;
}

interface Props {
  model: string;
  setModel: (model: string) => void;
  models: ModelOption[];
  loading?: boolean;
}

export default function ModelSelector({ model, setModel, models, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-gray-800 text-xs rounded-lg px-3 py-2 border border-gray-700 text-gray-500 cursor-wait">
        Carregando...
      </div>
    );
  }

  return (
    <select
      value={model}
      onChange={(e) => setModel(e.target.value)}
      className="bg-gray-800 text-xs rounded-lg px-3 py-2 border border-gray-700 outline-none focus:border-violet-500 transition-colors cursor-pointer max-w-[200px]"
    >
      {models.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </select>
  );
}
