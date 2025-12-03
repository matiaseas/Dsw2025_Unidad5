import { instance } from '../../shared/api/axiosInstance';

// Función unificada para obtener productos activos con paginación y búsqueda
export const getActiveProductsPaginated = async ({
  searchTerm = '',
  pageNumber = 1,
  pageSize = 10,
}) => {
  try {

    const response = await instance.get('api/products/active/paginated', {
      params: {
        Search: searchTerm,      // Usamos 'Search' para que coincida con el DTO FilterProduct
        PageNumber: pageNumber,  // El backend usa mayúsculas
        PageSize: pageSize,      // El backend usa mayúsculas
      },
    });

    // El backend devuelve un objeto ResponsePagination, no un array directo
    const data = response.data;

    return {
      data: data.productItems, // Lista de productos paginados
      pagination: {
        totalItems: data.total,
        totalPages: data.totalPages,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error al obtener productos paginados:', error);

    return { data: [], pagination: {}, error };
  }
};