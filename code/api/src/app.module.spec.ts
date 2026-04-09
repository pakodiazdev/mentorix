import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { HealthController } from "./health/health.controller";

jest.mock("@nestjs/mongoose", () => {
  const original =
    jest.requireActual<typeof import("@nestjs/mongoose")>("@nestjs/mongoose");
  return {
    ...original,
    MongooseModule: {
      ...original.MongooseModule,
      forRootAsync: jest.fn().mockReturnValue({
        module: class MockMongooseModule {},
        providers: [],
        exports: [],
      }),
    },
  };
});

describe("AppModule", () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });

  it("should have HealthController from HealthModule", () => {
    const controller = module.get(HealthController, { strict: false });
    expect(controller).toBeDefined();
  });
});
