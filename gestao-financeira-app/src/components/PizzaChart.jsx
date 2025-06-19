import { Doughnut } from 'react-chartjs-2';

function CategoryChart({ data }) {
  if (!data || !data.totals || data.totals.length === 0) {
    return <p>Nenhum dado disponível</p>;
  }
  
  const chartData = {
    labels: data.totals.map(item => item.categoryName),
    datasets: [
      {
        data: data.totals.map(item => item.total),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          // Adicionar mais cores conforme necessário
        ]
      }
    ]
  };
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Doughnut 
        data={chartData} 
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Distribuição por Categorias'
            }
          }
        }}
      />
    </div>
  );
}