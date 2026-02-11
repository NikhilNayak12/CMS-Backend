import Artifact from "../models/artifact.js";

/**
 * Create a new artifact
 */
export const createArtifactService = async ({
  title,
  content,
  userId,
  file,
}) => {
  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  let mediaUrl = null;
  if (file) {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: "cms-artifacts",
    });

    mediaUrl = uploadResult.secure_url;

    //Delte local file after upload
    fs.unlinkSync(file.path);
  }
  console.log("Media URL before saving artifact:", mediaUrl);

  const artifact = await Artifact.create({
    title,
    content,
    author: userId,
    media: mediaUrl || null,
  });
  return artifact;
};

export const getArtifactsService = async ({ userId, role }) => {
  if (role === "ADMIN") {
    // Admin sees everything
    return await Artifact.find().populate("author", "name email role");
  }

  // Non-admin sees only their own artifacts
  return await Artifact.find({ author: userId });
};
