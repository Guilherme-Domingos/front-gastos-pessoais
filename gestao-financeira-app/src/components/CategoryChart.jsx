import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registrar os componentes necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export function CategoryChart({ data }) {

  // Verificar se os dados estão disponíveis
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>Nenhum dado disponível para exibição</div>;
  }
  
  // Preparar cores dinâmicas baseadas no número de categorias
  const generateColors = (count) => {
    const baseColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
      '#FF9F40', '#00D8B6', '#8B52A1', '#FF4081', '#00BCD4'
    ];
    
    // Se tivermos mais categorias que cores, vamos gerar cores aleatórias adicionais
    const colors = [...baseColors];
    
    while (colors.length < count) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgb(${r}, ${g}, ${b})`);
    }
    
    return colors.slice(0, count);
  };
  
  const chartData = {
    labels: data.map(item => item.categoryName),
    datasets: [
      {
        data: data.map(item => item.total),
        backgroundColor: generateColors(data.length),
        borderColor: 'white',
        borderWidth: 1,
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      title: {
        display: true,
        text: 'Distribuição por Categorias',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: R$ ${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };
  
  return (
    <div style={{ height: '400px', maxWidth: '500px', margin: '0 auto' }}>
      <Doughnut 
        data={chartData} 
        options={chartOptions}
      />
    </div>
  );
}