import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { apiConfig } from "../../configs";
import { DebounceSelectProps } from "../../interfaces";
import { useLazyGetVideosQuery } from "../../redux/features/videos/videosApi";

const DebounceSelect = <
    ValueType extends {
        key?: string;
        label: React.ReactNode;
        value: string | number;
    } = any
>({
    debounceTimeout = 800,
    form,
    ...props
}: DebounceSelectProps<ValueType>) => {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const fetchRef = useRef(0);
    const [getVideos, { data: videos, isLoading, error }] =
        useLazyGetVideosQuery();

    const debounceFetcher = useMemo(() => {
        const loadOptions = async (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            const searchValue = value.trim();
            const queryOptions = searchValue
                ? { search: searchValue, page: 1, limit: apiConfig.PAGE_SIZE }
                : { page: 1, limit: apiConfig.PAGE_SIZE };

            await getVideos(queryOptions);

            if (fetchId !== fetchRef.current) {
                // for fetch callback order
                return;
            }
            setFetching(false);
        };

        return debounce(loadOptions, debounceTimeout);
    }, [getVideos, debounceTimeout]);

    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { target }: any = e;
        if (
            target.scrollTop + target.offsetHeight === target.scrollHeight &&
            !isLoading &&
            !error &&
            videos &&
            videos.totalResults > options.length
        ) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        getVideos({ page: currentPage, limit: apiConfig.PAGE_SIZE });
    }, [currentPage, getVideos]);

    useEffect(() => {
        if (!isLoading && !error && videos) {
            setOptions((prevOptions) => {
                const newOptions = videos.results.map((video) => ({
                    key: String(video.id),
                    label: video.title,
                    value: video.id,
                }));

                const updatedOptions = [...prevOptions, ...newOptions];

                const uniqueOptions = updatedOptions.reduce((acc, current) => {
                    const x = acc.find((item) => item.value === current.value);
                    if (!x) {
                        return acc.concat([current] as ValueType[]);
                    } else {
                        return acc;
                    }
                }, [] as ValueType[]);

                return uniqueOptions as ValueType[];
            });
        }
    }, [videos, isLoading, error]);

    useEffect(() => {
        if (form && form.getFieldValue("videoTitle") && props.value) {
            setOptions((prevOptions) => {
                const newOption = {
                    key: String(props.value),
                    label: form.getFieldValue("videoTitle"),
                    value: props.value,
                };

                const updatedOptions = [...prevOptions, newOption];

                const uniqueOptions = updatedOptions.reduce((acc, current) => {
                    const x = acc.find((item) => item.value === current.value);
                    if (!x) {
                        return acc.concat([current] as ValueType[]);
                    } else {
                        return acc;
                    }
                }, [] as ValueType[]);

                return uniqueOptions as ValueType[];
            });
        }
    }, [form, props.value]);

    return (
        <Select
            showSearch
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            onPopupScroll={handlePopupScroll}
            options={options}
        />
    );
};

export default DebounceSelect;
