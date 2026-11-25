import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";

const API_URL = "http://10.234.173.137:8080";

type Projet = {
    id: number;
    name: string;
    private?: boolean;
    isPrivate?: boolean;
    owner?: { id: number };
    tags?: { name: string }[];
    images?: { id: number; url: string }[];
};

export default function DetailsProjectScreen() {

    const { id } = useLocalSearchParams<{ id: string }>();

    const [projet, setProjet] = useState<Projet | null>(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        setChargement(true);
        setErreur(null);

        fetch(API_URL + "/project/" + id)
            .then((reponse) => {
                if (reponse.status === 404) {
                    throw new Error("Projet introuvable");
                }
                if (!reponse.ok) {
                    throw new Error("Erreur serveur (" + reponse.status + ")");
                }
                return reponse.json();
            })
            .then((projet: Projet) => setProjet(projet))
            .catch((e: Error) => setErreur(e.message))
            .finally(() => setChargement(false));
    }, [id]);

    if (chargement) {
        return (
            <View style={styles.centre}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (erreur || !projet) {
        return (
            <View style={styles.centre}>
                <Text style={styles.erreur}>{erreur ?? "Projet introuvable"}</Text>
            </View>
        );
    }

    const estPrive = projet.private ?? projet.isPrivate ?? false;

    return (
        <ScrollView contentContainerStyle={styles.contenu}>
            <Text style={styles.titre}>{projet.name}</Text>

            <Text style={styles.ligne}>Identifiant : {projet.id}</Text>
            <Text style={styles.ligne}>Visibilité : {estPrive ? "Privé" : "Public"}</Text>
            {projet.owner && (
                <Text style={styles.ligne}>Propriétaire : utilisateur n°{projet.owner.id}</Text>
            )}

            <Text style={styles.sousTitre}>Tags</Text>
            {projet.tags && projet.tags.length > 0 ? (
                <View style={styles.tags}>
                    {projet.tags.map((tag, index) => (
                        <Text key={index} style={styles.tag}>{tag.name}</Text>
                    ))}
                </View>
            ) : (
                <Text style={styles.vide}>Aucun tag</Text>
            )}

            <Text style={styles.sousTitre}>Images</Text>
            {projet.images && projet.images.length > 0 ? (
                projet.images.map((image) => (
                    <Image
                        key={image.id}
                        source={{ uri: image.url.startsWith("http") ? image.url : API_URL + "/" + image.url.replace(/^\//, "") }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ))
            ) : (
                <Text style={styles.vide}>Aucune image</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centre: { flex: 1, justifyContent: "center", alignItems: "center" },
    contenu: { padding: 16 },
    titre: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
    sousTitre: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 8 },
    ligne: { fontSize: 16, marginBottom: 4 },
    tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tag: { borderColor: "black", borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    vide: { fontStyle: "italic", color: "gray" },
    image: { width: "100%", height: 200, marginBottom: 10, borderRadius: 8 },
    erreur: { color: "red", fontSize: 16 },
});
