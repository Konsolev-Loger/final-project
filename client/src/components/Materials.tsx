import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllCategories } from '@/app/api/CategoryApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Package, Calculator } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@/components/css/Material.css';
import { CategoryType, MaterialType } from '@/app/type/CategoryType';
import { useNavigate } from 'react-router';
import {  setCategory, setMaterial } from '@/store/calculatorSlice';

export default function MaterialsAccordion() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | null>(null);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const toggleCategory = (id: number) => {
    setOpenCategoryId((prev) => (prev === id ? null : id));
  };

  const openModal = (material: MaterialType) => {
    setSelectedMaterial(material);
    document.body.classList.add('modal-open'); // ← блокируем фон
  };
  const closeModal = () => {
    setSelectedMaterial(null);
    document.body.classList.remove('modal-open'); // ← разблокируем фон
  };

  const navigate = useNavigate()

  return (
    <>
      <section className="materials-accordion-section">
        <div className="container mx-auto px-4">
          <h2 className="materials-accordion-title">Наши Материалы</h2>
          <p className="materials-accordion-subtitle">
            Выберите категорию и пролистайте премиум-материалы
          </p>

          <div>
            {categories.map((category: CategoryType) => {
              const isOpen = openCategoryId === category.id;
              const materials = category.materials?.filter((m) => m.img) || [];

              return (
                <div key={category.id} className="materials-category">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="materials-category-header"
                  >
                    <div className="materials-category-info">
                      <div className="materials-category-icon">
                        <Package size={28} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="materials-category-name">{category.name}</h3>
                        <p className="materials-category-count">
                          {materials.length} премиум материалов
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`materials-chevron ${isOpen ? 'open' : ''}`} />
                  </button>

                  <div className={`materials-content ${isOpen ? 'open' : ''}`}>
                    <div className="materials-scroll-wrapper">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const container = document.getElementById(`scroll-${category.id}`);
                          container?.scrollBy({ left: -380, behavior: 'smooth' });
                        }}
                        className="scroll-arrow scroll-arrow-left"
                      >
                        <ChevronLeft />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const container = document.getElementById(`scroll-${category.id}`);
                          container?.scrollBy({ left: 380, behavior: 'smooth' });
                        }}
                        className="scroll-arrow scroll-arrow-right"
                      >
                        <ChevronRight />
                      </button>

                      <div id={`scroll-${category.id}`} className="materials-scroll-container">
                        {materials.map((material: MaterialType) => (
                          <div
                            key={material.id}
                            className="materials-item"
                            onClick={() => openModal(material)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Card className="materials-card">
                              <div className="materials-image-wrapper">
                                <img
                                  src={`http://localhost:3000/material/${material.img}`}
                                  alt={material.name}
                                  className="materials-image"
                                />
                                {material.is_popular && (
                                  <div className="materials-popular-badge">Популярный</div>
                                )}
                                <div className="materials-overlay"></div>
                              </div>

                              <CardHeader className="materials-card-header">
                                <CardTitle className="materials-card-title">
                                  {material.name}
                                </CardTitle>
                              </CardHeader>

                              <CardContent className="materials-card-content">
                                <div className="flex justify-between items-end">
                                  <div>
                                    <div className="materials-price">{material.price} ₽</div>
                                    <p className="materials-price-label">за м²</p>
                                  </div>
                                  <Badge variant="outline" className="materials-stock-badge">
                                    В наличии
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Модальное окно */}
      {selectedMaterial && (
        <div className="material-modal-overlay open" onClick={closeModal}>
          <div className="material-modal" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:3000/material/${selectedMaterial.img}`}
              alt={selectedMaterial.name}
              className="material-modal-image"
            />

            <div className="material-modal-body">
              <h2 className="material-modal-title">{selectedMaterial.name}</h2>

              <p className="material-modal-description">
                {selectedMaterial.description ||
                  'Высококачественный премиум-материал с отличными характеристиками. Идеально подходит для современных интерьеров. Прочный, стильный и долговечный выбор для вашего проекта.'}
              </p>

              <div className="material-modal-price">{selectedMaterial.price} ₽ / м²</div>

            <button
            className="material-modal-calculate-btn"
            onClick={() => {
              // Находим категорию этого материала
              const category = categories.find(cat =>
                cat.materials?.some(m => m.id === selectedMaterial.id)
              );

              if (category) {
                dispatch(setCategory(category.id));
                dispatch(setMaterial(selectedMaterial.id));
              }

              navigate('/calculate');
              closeModal();
            }}
          >
            <Calculator size={28} />
            Рассчитать стоимость
          </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
