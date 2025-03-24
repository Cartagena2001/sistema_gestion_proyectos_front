"use client"
import React, { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskStats {
  completadas: number;
  en_progreso: number;
  pausada: number;
}

export function CharHome() {
  const [taskStats, setTaskStats] = useState<TaskStats>({
    completadas: 0,
    en_progreso: 0,
    pausada: 0
  });
  const [loading, setLoading] = useState(true);
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    import('react-apexcharts').then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  useEffect(() => {
    const fetchTaskStats = async () => {
      const supabase = createClient();
      const userData = localStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;

      if (user) {
        const { data: tasksData, error } = await supabase
          .from('tareas_usuarios')
          .select(`
            tareas!inner (
              estado
            )
          `)
          .eq('usuario_id', user.id);

        if (tasksData && tasksData.length > 0) {
          const stats = tasksData.reduce((acc: TaskStats, task) => {
            const estado = task.tareas.estado;
            if (estado) {
              acc[estado as keyof TaskStats] = (acc[estado as keyof TaskStats] || 0) + 1;
            }
            return acc;
          }, {
            completadas: 0,
            en_progreso: 0,
            pausada: 0
          });

          setTaskStats(stats);
        } else {
          setTaskStats({
            completadas: 0,
            en_progreso: 0,
            pausada: 0
          });
        }
      }
      setLoading(false);
    };

    fetchTaskStats();
  }, []);

  const chartOptions = {
    chart: {
      type: 'donut' as const,
    },
    labels: ['Completadas', 'En Progreso', 'pausada'],
    colors: ['#4ade80', '#60a5fa', '#fbbf24'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    legend: {
      position: 'bottom' as const,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const series = [
    taskStats.completadas,
    taskStats.en_progreso,
    taskStats.pausada
  ];

  if (loading || !Chart) {
    return <div>Cargando estadísticas...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Tareas</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="w-full max-w-lg">
          <Chart
            options={chartOptions}
            series={series}
            type="donut"
            height={350}
          />
        </div>
      </CardContent>
    </Card>
  );
}