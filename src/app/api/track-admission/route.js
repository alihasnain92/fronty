export async function GET(request, { params }) {
    const { code } = params;
  
    try {
      // Replace this with your actual API call to the backend
      const response = await fetch(`${process.env.BACKEND_URL}/api/admissions/${code}/status`);
      
      if (!response.ok) {
        return Response.json(
          { error: 'Invalid admission code' },
          { status: 404 }
        );
      }
  
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      return Response.json(
        { error: 'Failed to fetch admission status' },
        { status: 500 }
      );
    }
  }