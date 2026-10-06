import React from "react";
import {
    Skeleton,
    Stack,
} from "@mui/material";

function FAQSkeleton(): React.ReactElement {
    return (
        <Stack spacing={2}>
            <Skeleton
                variant="rounded"
                height={85}
            />

            <Skeleton
                variant="rounded"
                height={85}
            />

            <Skeleton
                variant="rounded"
                height={85}
            />
        </Stack>
    );
}

export default FAQSkeleton;