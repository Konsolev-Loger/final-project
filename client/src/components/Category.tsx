// import { getAllCategories } from '@/app/api/CategoryApi';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { useEffect } from 'react';

// export default function Category() {
//   const dispatch = useAppDispatch();
//   const { categories } = useAppSelector((state) => state.category);
//   console.log('category', categories);
//   useEffect(() => {
//     dispatch(getAllCategories());
//   }, []);

//   return (
//     <div>
//       {categories.map((cat) => (
//         <div key={cat.id}>
//           <h2>Категория: {cat.name}</h2>
//           <p>ID: {cat.id}</p>

//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
//             {cat.materials?.map((material) => (
//               <div
//                 key={material.id}
//                 style={{ border: '1px solid #ddd', padding: '10px', width: '200px' }}
//               >
//                 <p style={{ fontSize: '10px', color: 'red', wordBreak: 'break-all' }}>
//                   DEBUG SRC: "{material.img}"
//                 </p>

//                 <img
//                   src={`http://localhost:3000/material/${material.img}`}
//                   alt={material.name}
//                   style={{
//                     width: '100%',
//                     height: '150px',
//                     objectFit: 'cover',
//                     borderRadius: '8px',
//                   }}
//                 />
//                 <h4>{material.name}</h4>
//                 <p>{material.price}</p>
//                 {material.is_popular && <span style={{ color: 'red' }}>🔥 Популярный</span>}
//               </div>
//             ))}
//           </div>
//           <hr />
//         </div>
//       ))}
//     </div>
//   );
// }
