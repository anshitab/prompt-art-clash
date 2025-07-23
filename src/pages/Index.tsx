import ImageGenerator from '@/components/ImageGenerator';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">AI Art Competition</h1>
          <p className="text-xl text-muted-foreground">Create stunning artwork with AI</p>
        </div>
        <ImageGenerator />
      </div>
    </div>
  );
};

export default Index;
