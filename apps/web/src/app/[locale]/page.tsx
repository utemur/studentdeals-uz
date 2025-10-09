'use client';

import { Container, Card, CardContent, CardHeader, Button } from "@studentdeals/ui";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <Container className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("title")}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t("features.students.title")}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t("features.students.description")}</p>
            <Button className="mt-4 w-full">
              {t("features.students.cta")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t("features.merchants.title")}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t("features.merchants.description")}</p>
            <Button variant="outline" className="mt-4 w-full">
              {t("features.merchants.cta")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t("features.community.title")}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t("features.community.description")}</p>
            <Button variant="secondary" className="mt-4 w-full">
              {t("features.community.cta")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
