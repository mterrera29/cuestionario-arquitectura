import { useState } from 'react';

export interface Pregunta {
  texto: string;
  opciones: string[];
  correcta: number | number[];
  multiple?: boolean;
  tipo?: 'multiple' | 'ordenar';
}

interface Props {
  semana: number;
  preguntas: Pregunta[];
  onVolver: () => void; // Nueva prop
}

export default function App({ semana, preguntas, onVolver }: Props) {
  const [respuestas, setRespuestas] = useState<Record<number, any>>({});
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const seleccionar = (index: number, opcion: number) => {
    setRespuestas((prev) => ({ ...prev, [index]: opcion }));
  };

  const toggleMultiple = (index: number, opcion: number) => {
    const actuales = (respuestas[index] || []) as number[];
    const actualizado = actuales.includes(opcion)
      ? actuales.filter((o) => o !== opcion)
      : [...actuales, opcion];
    setRespuestas((prev) => ({ ...prev, [index]: actualizado }));
  };

  const actualizarOrden = (index: number, posicion: number, valor: number) => {
    const actuales =
      respuestas[index]?.slice() ||
      Array(preguntas[index].opciones.length).fill(null);
    actuales[posicion] = valor;
    setRespuestas((prev) => ({ ...prev, [index]: actuales }));
  };

  const corregir = () => setMostrarResultados(true);

  const esCorrecta = (pregunta: Pregunta, rta: any): boolean => {
    if (pregunta.tipo === 'ordenar') {
      return JSON.stringify(rta) === JSON.stringify(pregunta.correcta);
    }
    if (pregunta.multiple) {
      const correctas = (pregunta.correcta as number[]).sort().join(',');
      const dadas = (rta || []).sort().join(',');
      return correctas === dadas;
    } else {
      return pregunta.correcta === rta;
    }
  };

  return (
    <div>
      <h1>Cuestionario Semana {semana}</h1>
      {preguntas.map((p, i) => (
        <div
          key={i}
          className='question-block'
          style={{ whiteSpace: 'pre-line' }}
        >
          <p>
            {i + 1}. {p.texto}
          </p>
          <div className='options'>
            {p.tipo === 'ordenar' ? (
              <div className='order-select'>
                {Array.from({ length: p.opciones.length }).map(
                  (_, posicion) => (
                    <div key={posicion}>
                      <label>
                        Posición {posicion + 1}:{' '}
                        <select
                          value={
                            respuestas[i]?.[posicion] !== undefined
                              ? respuestas[i][posicion]
                              : ''
                          }
                          onChange={(e) =>
                            actualizarOrden(
                              i,
                              posicion,
                              parseInt(e.target.value)
                            )
                          }
                        >
                          <option value=''>Seleccionar</option>
                          {p.opciones.map((op, j) => (
                            <option
                              key={j}
                              value={j}
                              disabled={respuestas[i]?.includes(j)}
                            >
                              {op}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )
                )}
              </div>
            ) : (
              p.opciones.map((op, j) => {
                const seleccionado = respuestas[i];
                const checked = p.multiple
                  ? (seleccionado || []).includes(j)
                  : seleccionado === j;
                return (
                  <label key={j} style={{ whiteSpace: 'pre-line' }}>
                    <input
                      type={p.multiple ? 'checkbox' : 'radio'}
                      name={`pregunta-${i}`}
                      value={j}
                      checked={checked}
                      onChange={() =>
                        p.multiple ? toggleMultiple(i, j) : seleccionar(i, j)
                      }
                    />{' '}
                    {op}
                  </label>
                );
              })
            )}
            {mostrarResultados && (
              <p
                className={
                  esCorrecta(p, respuestas[i]) ? 'correct' : 'incorrect'
                }
              >
                {esCorrecta(p, respuestas[i]) ? '✔ Correcto' : '✘ Incorrecto'}
              </p>
            )}
          </div>
        </div>
      ))}
      <button onClick={corregir}>Corregir</button>
      <button onClick={onVolver} style={{ marginLeft: '10px' }}>
        Volver atrás
      </button>
    </div>
  );
}
