import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import SearchBar from "../components/SearchBar";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "../components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "../components/TrendingCard";

export default function Index() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    })
  );

  const isLoading = moviesLoading || trendingLoading;
  const hasError = moviesError || trendingError;
  const errorMessage = moviesError?.message || trendingError?.message;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchTrending(), refetchMovies()]);
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchTrending, refetchMovies]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0000ff"]}
            tintColor="#ffffff"
            titleColor="#ffffff"
            title="Memperbarui data..."
          />
        }
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {(isLoading && !refreshing) ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : hasError ? (
          <Text className="text-white text-center mt-10">Error: {errorMessage}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />

            {trendingMovies && trendingMovies.length > 0 && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                />
              </View>
            )}

            {movies && movies.length > 0 && (
              <>
                <Text className="text-lg text-white font-bold mt-5 mb-3">
                  Latest Movies
                </Text>

                <FlatList
                  data={movies}
                  renderItem={({ item }) => <MovieCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}