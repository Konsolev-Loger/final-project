// 'use client';

// import { getAllCategories } from '@/app/api/CategoryApi';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { ChevronDown, Package } from 'lucide-react';
// import { cn } from '@/lib/utils'; // если у тебя есть утилита cn, или просто замени на className

// export default function MaterialsAccordion() {
//   const dispatch = useAppDispatch();
//   const { categories } = useAppSelector((state) => state.category);
//   const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

//   useEffect(() => {
//     dispatch(getAllCategories());
//   }, [dispatch]);

//   const toggleCategory = (id: number) => {
//     setOpenCategoryId((prev) => (prev === id ? null : id));
//   };

//   return (
//     <section className="py-20 bg-background">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//   <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
//             Наши Материалы
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Выберите категорию и посмотрите доступные материалы премиум-качества
//           </p>
//         </div>

//         <div className="space-y-6">
//           {categories.map((category) => {
//             const isOpen = openCategoryId === category.id;
//             const materials = category.materials?.filter((m) => m.img) || [];

//             return (
//               <div
//                 key={category.id}
//                 className="border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-300"
//               >
//                 {/* Заголовок категории */}
//                 <button
//                   onClick={() => toggleCategory(category.id)}
//                   className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
//                       <Package className="w-6 h-6 text-primary" />
//                     </div>
//                     <h3 className="text-2xl font-semibold text-foreground">
//                       {category.name}
//                     </h3>
//                     <Badge variant="secondary" className="ml-3">
//                       {materials.length} материалов
//                     </Badge>
//                   </div>

//                   <ChevronDown
//                     className={cn(
//                       "w-6 h-6 text-muted-foreground transition-transform duration-300",
//                       isOpen && "rotate-180"
//                     )}
//                   />
//                 </button>

//                 {/* Содержимое — карточки (с анимацией появления) */}
//                 <div
//                   className={cn(
//                     "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-8 pb-8 pt-4 transition-all duration-500 ease-in-out",
//                     isOpen
//                       ? "max-h-screen opacity-100"
//                       : "max-h-0 opacity-0 overflow-hidden"
//                   )}
//                   style={{
//                     transition: "max-height 0.5s ease-in-out, opacity 0.4s ease-in-out, padding 0.4s ease-in-out",
//                   }}
//                 >
//                   {materials.map((material) => (
//                     <Card
//                       key={material.id}
//                       className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
//                     >
//                       <div className="relative overflow-hidden rounded-t-lg">
//                         <img
//                           src={`http://localhost:3000/material/${material.img}`}
//                           alt={material.name}
//                           className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
//                         />
//                         {material.is_popular && (
//                           <Badge className="absolute top-3 right-3 bg-red-500 text-white">
//                             Популярный
//                           </Badge>
//                         )}
//                       </div>

//                       <CardHeader className="pb-3">
//                         <CardTitle className="text-lg text-foreground">
//                           {material.name}
//                         </CardTitle>
//                       </CardHeader>

//                       <CardContent>
//                         <div className="text-2xl font-bold text-primary">
//                           {material.price} ₽
//                           <span className="text-sm font-normal text-muted-foreground ml-1">
//                             / м²
//                           </span>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {categories.length === 0 && (
//           <div className="text-center py-16 text-muted-foreground">
//             Загрузка категорий...
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }