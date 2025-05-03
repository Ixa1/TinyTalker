const DashboardCards = () => {
    const stats = [
      { title: 'Users', count: 1243 },
      { title: 'Lessons', count: 89 },
      { title: 'Questions', count: 678 },
      { title: 'Reports', count: 45 },
    ];
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded shadow text-center">
            <h2 className="text-lg font-bold">{stat.title}</h2>
            <p className="text-2xl text-blue-600">{stat.count}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default DashboardCards;
  