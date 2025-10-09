import { Container, Card, CardContent, CardHeader, Button } from "@studentdeals/ui";

export default function HomePage() {
  return (
    <Container className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Лучшие предложения для студентов
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Находите эксклюзивные скидки и предложения от местных и международных брендов специально для студентов Узбекистана
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Для студентов</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Получайте скидки до 50% на еду, развлечения, обучение и многое другое</p>
            <Button className="mt-4 w-full">
              Найти предложения
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Для бизнеса</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Привлекайте студентов как лояльных клиентов с помощью специальных предложений</p>
            <Button variant="outline" className="mt-4 w-full">
              Стать партнером
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Сообщество</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Присоединяйтесь к активному сообществу студентов и делитесь опытом</p>
            <Button variant="secondary" className="mt-4 w-full">
              Присоединиться
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
