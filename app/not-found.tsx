import Link from "next/link";
import Container from "@/components/layout/Container";
import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import Box from "@/components/layout/Box";
import SearchInput from "@/components/ui/SearchInput";

export default function NotFoundPage() {
    return (
        <Container>
            <Box display="flex" direction="col" gap="4">
                <Typography variant="h1" uppercase={true} align="center">Página no encontrada</Typography>
                <SearchInput />
                <Button variant="outline" asChild>
                    <Link href="/">Volver a la tienda</Link>
                </Button>
            </Box>
        </Container>
    );
}