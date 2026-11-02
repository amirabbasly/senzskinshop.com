export default function ArticleContent({ content = '' }) {
  const blocks = String(content).split(/\n{2,}/);

  return (
    <div className="prose-fa">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith('## ')) {
          return <h2 key={index}>{trimmed.replace(/^##\s*/, '')}</h2>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={index}>{trimmed.replace(/^###\s*/, '')}</h3>;
        }
        if (trimmed.split('\n').every((line) => line.trim().startsWith('- '))) {
          return (
            <ul key={index}>
              {trimmed.split('\n').map((line, i) => (
                <li key={i}>{line.replace(/^-\s*/, '')}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{trimmed}</p>;
      })}
    </div>
  );
}
